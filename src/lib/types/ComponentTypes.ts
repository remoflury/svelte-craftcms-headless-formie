import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes, HTMLFormAttributes } from 'svelte/elements';

export type AfterSubmitState = { message: string | null; isSuccess: boolean };

export type FormieFormProps = HTMLFormAttributes & {
	publicCmsApi: string;
	handle: string;
	submitButton: Snippet;
	submitButtonText?: string; // bindable
	isLoading?: boolean;
	onsuccessfulsubmit?: (message: string | null) => void;
	onerror?: (message: string | null) => void;
	skeletonSnippet?: Snippet;
	errorSnippet?: Snippet;
	afterSubmitState?: AfterSubmitState;
	afterSubmitSnippet?: Snippet; // component, which can be shown after submission
	recaptchaHint?: Snippet;
	recaptchaKey?: string;
	siteId?: string | number;
	pagination: Snippet<
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
// MouseEventHandler<HTMLButtonElement> & ((targetIndex: number)
