export async function parseUploadedFile(file: File): Promise<{
  fileName: string;
  text: string;
  wordCount: number;
  characterCount: number;
}> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/parse-file', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Server responded with ${response.status}`);
    }

    return await response.json();
  } catch (err: any) {
    console.warn('Backend parse failed, attempting client fallback for text files...', err);
    // Fallback for TXT files if server upload has issues
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const text = await file.text();
      const clean = text.replace(/\r\n/g, '\n').trim();
      return {
        fileName: file.name,
        text: clean,
        characterCount: clean.length,
        wordCount: clean.split(/\s+/).filter(Boolean).length,
      };
    }
    throw new Error(err.message || 'Unable to parse file. Please paste text directly.');
  }
}
