import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes, HTMLFormAttributes } from 'svelte/elements';

export type AfterSubmitState = { message: string | null; isSuccess: boolean };

export type FormieFormProps = HTMLFormAttributes & {
	publicCmsApi: string;
	handle: string;
	isLoading?: boolean;
	recaptchaKey?: string;
	siteId?: string | number;
	// events
	onaftersubmit?: (d: AfterSubmitState) => void;
	// Snippets
	submitButton: Snippet<[HTMLButtonAttributes & { text: string }]>;
	skeletonSnippet?: Snippet;
	errorSnippet?: Snippet;
	afterSubmitSnippet?: Snippet<[{ state: AfterSubmitState }]>;
	recaptchaHint?: Snippet;
	pagination?: Snippet<
		[
			{
				currentIndex: number;
				totalPages: number | undefined;
				backBtn: MultistepBtnProps | undefined;
				nextBtn: MultistepBtnProps | undefined;
			}
		]
	>;
};

type MultistepBtnProps = HTMLButtonAttributes & {
	text: string;
	onclick: (targetIndex: number) => void;
};
