// Handle the configuration loading for headscale.
// Functionally only used for reading and writing the configuration file.
// Availability checks and other configuration checks are done in the headplane
// configuration file that's adjacent to this one.
//
// Around the codebase, this is referred to as the config
// Refer to this file on juanfont/headscale for the default values:
// https://github.com/juanfont/headscale/blob/main/hscontrol/types/config.go
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { type Document, parseDocument } from 'yaml';
import { z } from 'zod';

import log from '~/utils/log';

const goBool = z
	.union([z.boolean(), z.literal('true'), z.literal('false')])
	.transform((value) => {
		if (typeof value === 'boolean') {
			return value;
		}

		return value === 'true';
	});

const goDuration = z.union([z.literal(0), z.string()]);

const HeadscaleConfig = z.object({
	tls_letsencrypt_cache_dir: z.string().default('/var/www/cache'),
	tls_letsencrypt_challenge_type: z
		.enum(['HTTP-01', 'TLS-ALPN-01'])
		.default('HTTP-01'),

	tls_letsencrypt_hostname: z.string().optional(),
	tls_letsencrypt_listen: z.string().optional(),

	tls_cert_path: z.string().nullish(),
	tls_key_path: z.string().nullish(),

	server_url: z.string().regex(/^https?:\/\//),
	listen_addr: z.string(),
	metrics_listen_addr: z.string().optional(),
	grpc_listen_addr: z.string().default(':50443'),
	grpc_allow_insecure: goBool.default(false),

	disable_check_updates: goBool.default(false),
	ephemeral_node_inactivity_timeout: goDuration.default('120s'),
	randomize_client_port: goBool.default(false),

	acme_email: z.string().optional(),
	acme_url: z.string().optional(),

	unix_socket: z.string().default('/var/run/headscale/headscale.sock'),
	unix_socket_permission: z.string().default('0o770'),

	policy: z
		.object({
			mode: z.enum(['file', 'database']).default('file'),
			path: z.string().optional(),
		})
		.optional(),

	tuning: z
		.object({
			batch_change_delay: goDuration.default('800ms'),
			node_mapsession_buffered_chan_size: z.number().default(30),
		})
		.optional(),

	noise: z.object({
		private_key_path: z.string(),
	}),

	log: z
		.object({
			level: z.string().default('info'),
			format: z.enum(['text', 'json']).default('text'),
		})
		.default({ level: 'info', format: 'text' }),

	logtail: z
		.object({
			enabled: goBool.default(false),
		})
		.default({ enabled: false }),

	cli: z
		.object({
			address: z.string().optional(),
			api_key: z.string().optional(),
			timeout: goDuration.default('10s'),
			insecure: goBool.default(false),
		})
		.optional(),

	prefixes: z.object({
		allocation: z.enum(['sequential', 'random']).default('sequential'),
		v4: z.string(),
		v6: z.string(),
	}),

	dns: z.object({
		magic_dns: goBool.default(true),
		base_domain: z.string().default('headscale.net'),
		nameservers: z
			.object({
				global: z.array(z.string()).default([]),
				split: z.record(z.array(z.string())).default({}),
			})
			.default({ global: [], split: {} }),
		search_domains: z.array(z.string()).default([]),
		extra_records: z
			.array(
				z.object({
					name: z.string(),
					type: z.literal('A'),
					value: z.string(),
				}),
			)
			.default([]),
	}),

	oidc: z
		.object({
			only_start_if_oidc_is_available: goBool.default(false),
			issuer: z.string().optional(),
			client_id: z.string().optional(),
			client_secret: z.string().optional(),
			client_secret_path: z.string().nullish(),
			scope: z.array(z.string()).default(['openid', 'profile', 'email']),
			extra_params: z.record(z.unknown()).default({}),
			allowed_domains: z.array(z.string()).optional(),
			allowed_users: z.array(z.string()).optional(),
			allowed_groups: z.array(z.string()).optional(),
			strip_email_domain: goBool.default(false),
			expiry: goDuration.default('180d'),
			use_expiry_from_token: goBool.default(false),
			pkce: z
				.object({
					enabled: goBool.default(false).optional(),
					method: z.enum(['S256', 'plain']).default('S256').optional(),
				})
    
		})
		.optional(),

	database: z.union([
		z.object({
			type: z.literal('sqlite'),
			debug: goBool.default(false),
			sqlite: z.object({
				path: z.string(),
			}),
		}),
		z.object({
			type: z.literal('sqlite3'),
			debug: goBool.default(false),
			sqlite: z.object({
				path: z.string(),
			}),
		}),
		z.object({
			type: z.literal('postgres'),
			debug: goBool.default(false),
			postgres: z.object({
				host: z.string(),
				port: z.number(),
				name: z.string(),
				user: z.string(),
				pass: z.string(),
				ssl: goBool.default(true),
				max_open_conns: z.number().default(10),
				max_idle_conns: z.number().default(10),
				conn_max_idle_time_secs: z.number().default(3600),
			}),
		}),
	]),

	derp: z.object({
		server: z.object({
			enabled: goBool.default(true),
			region_id: z.number().optional(),
			region_code: z.string().optional(),
			region_name: z.string().optional(),
			stun_listen_addr: z.string().optional(),
			private_key_path: z.string().optional(),

			ipv4: z.string().optional(),
			ipv6: z.string().optional(),
			automatically_add_embedded_derp_region: goBool.default(true),
		}),

		urls: z.array(z.string()).optional(),
		paths: z.array(z.string()).optional(),
		auto_update_enabled: goBool.default(true),
		update_frequency: goDuration.default('24h'),
	}),
});

export type HeadscaleConfig = z.infer<typeof HeadscaleConfig>;

export let configYaml: Document | undefined;
export let config: HeadscaleConfig | undefined;

export async function loadConfig(path?: string) {
	if (config) {
		return config;
	}

	if (!path) {
		throw new Error('Path is required to lazy load config');
	}

	log.debug('CFGX', 'Loading Headscale configuration from %s', path);
	const data = await readFile(path, 'utf8');
	configYaml = parseDocument(data);

	if (process.env.HEADSCALE_CONFIG_UNSTRICT === 'true') {
		log.debug('CFGX', 'Loaded Headscale configuration in non-strict mode');
		const loaded = configYaml.toJSON() as Record<string, unknown>;
		config = {
			...loaded,
			tls_letsencrypt_cache_dir:
				loaded.tls_letsencrypt_cache_dir ?? '/var/www/cache',
			tls_letsencrypt_challenge_type:
				loaded.tls_letsencrypt_challenge_type ?? 'HTTP-01',
			grpc_listen_addr: loaded.grpc_listen_addr ?? ':50443',
			grpc_allow_insecure: loaded.grpc_allow_insecure ?? false,
			randomize_client_port: loaded.randomize_client_port ?? false,
			unix_socket: loaded.unix_socket ?? '/var/run/headscale/headscale.sock',
			unix_socket_permission: loaded.unix_socket_permission ?? '0o770',
			tuning: loaded.tuning ?? {
				batch_change_delay: '800ms',
				node_mapsession_buffered_chan_size: 30,
			},

			log: loaded.log ?? {
				level: 'info',
				format: 'text',
			},

			logtail: loaded.logtail ?? {
				enabled: false,
			},

			cli: loaded.cli ?? {
				timeout: '10s',
				insecure: false,
			},

			prefixes: loaded.prefixes ?? {
				allocation: 'sequential',
				v4: '',
				v6: '',
			},

			dns: loaded.dns ?? {
				nameservers: {
					global: [],
					split: {},
				},
				search_domains: [],
				extra_records: [],
				magic_dns: false,
				base_domain: 'headscale.net',
			},
		} as HeadscaleConfig;

		log.warn('CFGX', 'Loaded Headscale configuration in non-strict mode');
		log.warn('CFGX', 'By using this mode you forfeit GitHub issue support');
		log.warn('CFGX', 'This is very dangerous and comes with a few caveats:');
		log.warn('CFGX', 'Headplane could very easily crash');
		log.warn('CFGX', 'Headplane could break your Headscale installation');
		log.warn('CFGX', 'The UI could throw random errors/show incorrect data');
		log.warn('CFGX', '');
		return config;
	}

	try {
		log.debug('CFGX', 'Attempting to parse Headscale configuration');
		config = await HeadscaleConfig.parseAsync(configYaml.toJSON());
	} catch (error) {
		log.debug('CFGX', 'Failed to load Headscale configuration');
		if (error instanceof z.ZodError) {
			log.error('CFGX', 'Recieved invalid configuration file');
			log.error('CFGX', 'The following schema issues were found:');
			for (const issue of error.issues) {
				const path = issue.path.map(String).join('.');
				const message = issue.message;

				log.error('CFGX', `  '${path}': ${message}`);
			}

			log.error('CFGX', '');
			log.error('CFGX', 'Resolve these issues and try again.');
			log.error('CFGX', 'Headplane will operate without the config');
			log.error('CFGX', '');
		}

		throw error;
	}

	return config;
}

// This is so obscenely dangerous, please have a check around it
export async function patchConfig(partial: Record<string, unknown>) {
	if (!configYaml || !config) {
		throw new Error('Config not loaded');
	}

	log.debug('CFGX', 'Patching Headscale configuration');
	for (const [key, value] of Object.entries(partial)) {
		log.debug('CFGX', 'Patching %s with %s', key, value);
		// If the key is something like `test.bar."foo.bar"`, then we treat
		// the foo.bar as a single key, and not as two keys, so that needs
		// to be split correctly.

		// Iterate through each character, and if we find a dot, we check if
		// the next character is a quote, and if it is, we skip until the next
		// quote, and then we skip the next character, which should be a dot.
		// If it's not a quote, we split it.
		const path = [];
		let temp = '';
		let inQuote = false;

		for (const element of key) {
			if (element === '"') {
				inQuote = !inQuote;
			}

			if (element === '.' && !inQuote) {
				path.push(temp.replaceAll('"', ''));
				temp = '';
				continue;
			}

			temp += element;
		}

		// Push the remaining element
		path.push(temp.replaceAll('"', ''));
		if (value === null) {
			configYaml.deleteIn(path);
			continue;
		}

		configYaml.setIn(path, value);
	}

	config =
		process.env.HEADSCALE_CONFIG_UNSTRICT === 'true'
			? (configYaml.toJSON() as HeadscaleConfig)
			: await HeadscaleConfig.parseAsync(configYaml.toJSON());

	const path = resolve(process.env.CONFIG_FILE ?? '/etc/headscale/config.yaml');
	log.debug('CFGX', 'Writing patched configuration to %s', path);
	await writeFile(path, configYaml.toString(), 'utf8');
}
