import { describe, expect, test } from 'vitest';
import { allowedFileTypes, getAllowedFileTypes } from './mutationUtils.js';

describe('mutationUtils', () => {
	test.concurrent('getAllowedFileTypes, all', () => {
		const all = getAllowedFileTypes([]); // '*'
		const word = getAllowedFileTypes([allowedFileTypes.word.key]);
		const image = getAllowedFileTypes([allowedFileTypes.image.key]);
		const pdf = getAllowedFileTypes([allowedFileTypes.pdf.key]);
		const audio = getAllowedFileTypes([allowedFileTypes.audio.key]);
		const captionsSubtitles = getAllowedFileTypes([allowedFileTypes.captionsSubtitles.key]);
		const json = getAllowedFileTypes([allowedFileTypes.json.key]);
		const javascript = getAllowedFileTypes([allowedFileTypes.javascript.key]);
		const excel = getAllowedFileTypes([allowedFileTypes.excel.key]);
		const text = getAllowedFileTypes([allowedFileTypes.text.key]);
		const powerpoint = getAllowedFileTypes([allowedFileTypes.powerpoint.key]);
		const video = getAllowedFileTypes([allowedFileTypes.video.key]);

		expect(all).toEqual(allowedFileTypes.all.result);
		expect(word).toEqual(allowedFileTypes.word.result);
		expect(image).toEqual(allowedFileTypes.image.result);
		expect(pdf).toEqual(allowedFileTypes.pdf.result);
		expect(audio).toEqual(allowedFileTypes.audio.result);
		expect(captionsSubtitles).toEqual(allowedFileTypes.captionsSubtitles.result);
		expect(json).toEqual(allowedFileTypes.json.result);
		expect(javascript).toEqual(allowedFileTypes.javascript.result);
		expect(excel).toEqual(allowedFileTypes.excel.result);
		expect(text).toEqual(allowedFileTypes.text.result);
		expect(powerpoint).toEqual(allowedFileTypes.powerpoint.result);
		expect(video).toEqual(allowedFileTypes.video.result);

		// multiple
		const multiple = getAllowedFileTypes([allowedFileTypes.video.key, allowedFileTypes.json.key]);
		expect(multiple).toEqual(`${allowedFileTypes.video.result}, ${allowedFileTypes.json.result}`);
	});
});
