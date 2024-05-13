/* @jsxRuntime automatic */
/** @jsxImportSource react */

import fs from 'node:fs';
import satori, { type SatoriOptions } from 'satori';
import sharp from 'sharp';
import { FooterDescription, Site, SiteDescription, SiteTitle } from '~/config';

// satori may have bug when rendering <img src="data:image/svg+xml;base64,...">. You can convert to png like below:
// const logoImage =
// 	'data:image/png;base64,' +
// 	(await sharp('src/assets/logo.svg').png().toBuffer()).toString('base64');

// or use a png file
const logoImage = `data:image/png;base64,${(
	await fs.promises.readFile('src/assets/og-logo.png')
).toString('base64')}`;

// the font file is integrated to prevent Github action failure for now.
const font = async () => {
	const fontPath = 'src/assets/LXGWWenKaiGBScreen.ttf';
	if (!fs.existsSync(fontPath)) {
		// eslint-disable-next-line no-console
		console.log('downloading a font for open graph, wait a minute');
		const remoteFont =
			'https://github.com/lxgw/LxgwWenKai-Screen/releases/latest/download/LXGWWenKaiGBScreen.ttf';
		const response = await fetch(remoteFont);
		if (!response.ok) {
			throw new Error(
				`can not download font from ${remoteFont} while generating open graph image`,
			);
		}
		fs.promises.writeFile(fontPath, new DataView(await response.arrayBuffer()));
	}
	return fs.promises.readFile(fontPath);
};

const options: SatoriOptions = {
	width: 1200,
	height: 630,
	fonts: [
		{
			name: 'LXGW WenKai GB Screen',
			data: await font(),
		},
	],
	tailwindConfig: {
		theme: {
			fontFamily: {
				sans: ['"LXGW WenKai GB Screen"'],
				serif: ['"LXGW WenKai GB Screen"'],
				mono: ['Menlo', 'Consolas'],
			},
		},
	},
	loadAdditionalAsset: async (languageCode, segment) => {
		if (languageCode === 'emoji') {
			try {
				const response = await fetch(
					`https://cdn.jsdelivr.net/gh/shuding/fluentui-emoji-unicode/assets/${segment}_color.svg`,
				);
				if (!response.ok) {
					return segment;
				}
				return `data:image/png;base64,${(
					await sharp(await response.arrayBuffer())
						.png()
						.toBuffer()
				).toString('base64')}`;
			} catch {
				return segment;
			}
		}
		return segment;
	},
};

declare module 'react' {
	interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
		tw?: string;
	}
}

export async function siteOpenGraph() {
	const template = (
		<div tw="flex h-full w-full flex-col justify-between bg-[#202124] pb-3 pt-6 text-neutral-50">
			<div
				tw="mx-auto flex w-[85%] grow flex-col bg-[#212223] px-5 py-2"
				style={{ boxShadow: '0 0 20px 10px rgb(136, 136, 136, 0.35)' }}
			>
				<div tw="grow flex flex-col pl-4 mt-2">
					<img alt="logo" src={logoImage} tw="h-20 w-18" />
					<div tw="mt-2 grow flex flex-col items-center">
						<p tw="text-9xl font-bold">{SiteTitle}</p>
						<p tw="text-7xl text-neutral-500 font-bold">{SiteDescription}</p>
					</div>
				</div>
			</div>
			<div tw="mt-5 flex flex-col items-center text-xl">
				<div>{FooterDescription}</div>
				<div tw="text-neutral-400">{`© ${new Date().getFullYear()} ${Site}`}</div>
			</div>
		</div>
	);
	return await sharp(Buffer.from(await satori(template, options)))
		.png()
		.toBuffer();
}

type Config = {
	title: string;
	description?: string;
	tags?: string[];
};

export async function postOpenGraph({ title, description, tags }: Config) {
	const template = (
		<div tw="flex h-full w-full flex-col justify-between bg-[#202124] pb-3 pt-6 text-neutral-50">
			<div
				tw="mx-auto flex w-[85%] grow flex-col bg-[#212223] px-5 py-2"
				style={{ boxShadow: '0 0 20px 10px rgb(136, 136, 136, 0.35)' }}
			>
				<div tw="flex justify-between mt-2">
					<img alt="logo" src={logoImage} tw="h-20 w-18" />
					<p tw="text-3xl">{SiteDescription}</p>
				</div>
				<div tw="grow flex flex-col pl-4 mt-5">
					<p tw="text-6xl font-bold">{title}</p>
					<p tw="text-4xl font-bold">{description}</p>
					<div tw="flex text-neutral-400">
						{tags?.map((tag) => (
							<p tw="text-xl mr-4" key={tag}>
								{tag}
							</p>
						))}
					</div>
				</div>
			</div>
			<div tw="mt-5 flex flex-col items-center text-xl">
				<div>{FooterDescription}</div>
				<div tw="text-neutral-400">{`© ${new Date().getFullYear()} ${Site}`}</div>
			</div>
		</div>
	);
	return await sharp(Buffer.from(await satori(template, options)))
		.png()
		.toBuffer();
}
