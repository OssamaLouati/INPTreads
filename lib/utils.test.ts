import { cn, isBase64Image, formatDateString, formatThreadCount } from './utils'; // Replace './utils' with the actual path of your file

describe('cn', () => {
  it('merges class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
    expect(cn('class1', undefined, 'class3')).toBe('class1 class3');
    // Add more test cases as needed
  });
});

describe('isBase64Image', () => {
  it('validates Base64 image strings', () => {
    expect(isBase64Image('data:image/png;base64,VALID_BASE64')).toBeTruthy();
    expect(isBase64Image('data:image/jpeg;base64,VALID_BASE64')).toBeTruthy();
    expect(isBase64Image('invalid_base64')).toBeFalsy();
    // Add more test cases as needed
  });
});

// describe('formatDateString', () => {
//     it('formats date strings correctly', () => {
//       const fixedDate = '2023-01-01T00:00:00Z'; // UTC time, which is the same as GMT for this purpose
//       const expectedFormat = '1:00 AM - Jan 1, 2023'; // Expected format in GMT +1
//       expect(formatDateString(fixedDate)).toBe(expectedFormat);
//       // Add more test cases as needed
//     });
//   });
  

describe('formatThreadCount', () => {
  it('formats thread counts correctly', () => {
    expect(formatThreadCount(0)).toBe('No Threads');
    expect(formatThreadCount(1)).toBe('01 Thread');
    expect(formatThreadCount(10)).toBe('10 Threads');
    // Add more test cases as needed
  });
});
