import { describe, it, expect } from 'vitest';
import { stringifyCssObject } from '../stringifyCssObject';

describe('stringifyCssObject', () => {
	it('should return undefined for undefined input', () => {
		expect(stringifyCssObject(undefined)).toBeUndefined();
	});

	it('should convert simple properties', () => {
		const result = stringifyCssObject({ color: 'red', width: '100px' });
		expect(result).toBe('color: red; width: 100px');
	});

	it('should convert camelCase to kebab-case', () => {
		const result = stringifyCssObject({
			backgroundColor: '#ffffff',
			fontSize: '16px',
			lineHeight: '1.5'
		});
		expect(result).toBe('background-color: #ffffff; font-size: 16px; line-height: 1.5');
	});

	it('should handle numeric values', () => {
		const result = stringifyCssObject({
			width: 600,
			height: 400
		});
		expect(result).toBe('width: 600; height: 400');
	});

	it('should handle mixed camelCase and single-word properties', () => {
		const result = stringifyCssObject({
			color: 'blue',
			backgroundColor: 'white',
			padding: '10px',
			borderRadius: '5px'
		});
		expect(result).toBe('color: blue; background-color: white; padding: 10px; border-radius: 5px');
	});

	it('should handle multiple capital letters', () => {
		const result = stringifyCssObject({
			WebkitTransform: 'scale(1)',
			MozTransform: 'scale(1)'
		});
		expect(result).toBe('-webkit-transform: scale(1); -moz-transform: scale(1)');
	});

	it('should return undefined for empty object', () => {
		const result = stringifyCssObject({});
		expect(result).toBe('');
	});
});
