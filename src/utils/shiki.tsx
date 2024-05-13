/* @jsxRuntime automatic */
/** @jsxImportSource hastscript */

import type { Element, ElementContent } from 'hast';
import type { ShikiTransformer } from 'shiki';
import { CopyButtonDoneIcon, CopyButtonIcon } from './shikiCopyButton';

interface TransformerEnhanserOptions {
	// class name for language hint, or `false` to disable
	languageHint?: string | boolean;
	// class name for copy button, or `false` to disable
	copyButton?: string | boolean;
}

const languageHintDefaultClass =
	'absolute right-2 -top-3 text-sm group-hover:hidden';
const copyButtonDefaultClass =
	'copy group hidden absolute right-2 top-2 px-1 bg-[#121212] rounded-md dark:bg-neutral-100 group-hover:block';

// transformerEnhanser provides language hint and copy button on right top corner. The button click event should be handled manually. For example:
/*
const copy = async (copyButton) => {
	const code = copyButton.nextElementSibling?.children[0];
	if (!code) {
		return;
	}
	await navigator.clipboard.writeText(code.textContent);
	copyButton.setAttribute('aria-pressed', 'true');
	setTimeout(() => {
		copyButton.setAttribute('aria-pressed', 'false');
	}, 700);
};

const copyButtons = Array.from(document.querySelectorAll('.prose button.copy'));
for (const copyButton of copyButtons) {
	copyButton.addEventListener('click', () => copy(copyButton));
}
*/
export function transformerEnhanser(
	o?: TransformerEnhanserOptions,
): ShikiTransformer {
	let options = o;
	if (!options) {
		options = {
			languageHint: languageHintDefaultClass,
			copyButton: copyButtonDefaultClass,
		};
	}
	if (options.languageHint === undefined) {
		options.languageHint = languageHintDefaultClass;
	}
	if (options.copyButton === undefined) {
		options.copyButton = copyButtonDefaultClass;
	}
	return {
		name: 'astro-theme-zozo:enhanser',
		preprocess: (code, preprocessoOptions) => {
			if (!preprocessoOptions.meta) {
				preprocessoOptions.meta = {};
			}
			preprocessoOptions.meta.lang = preprocessoOptions.lang;
			return code;
		},
		root: (root) => {
			const pre = root.children[0] as Element;
			const wrapper = <div class="group relative" />;
			if (options.languageHint) {
				wrapper.children.push(
					(
						<span class={options.languageHint}>{pre.properties?.lang}</span>
					) as ElementContent,
				);
			}
			if (options.copyButton) {
				// the click event is handled in MarkdownLayout
				const button = (
					<button
						type="button"
						class={options.copyButton}
						title="Copy code"
						aria-label="Copy code"
						aria-pressed="false"
					/>
				) as Element;
				(CopyButtonIcon as Element).properties.class =
					'size-6 fill-neutral-100 dark:fill-[#121212] group-aria-pressed:hidden';
				(CopyButtonDoneIcon as Element).properties.class =
					'hidden size-6 fill-neutral-100 dark:fill-[#121212] group-aria-pressed:block';
				button.children.push(
					CopyButtonIcon as ElementContent,
					CopyButtonDoneIcon as ElementContent,
				);
				wrapper.children.push(button as ElementContent);
			}
			wrapper.children.push(pre);
			//@ts-expect-error shiki declared hastscript types again
			root.children[0] = wrapper;
		},
	};
}
