import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

describe('createNote', () => {
  it('archivedAt: null 포함하여 POST 요청을 보낸다', async () => {
    vi.resetModules();
    const { createNote } = await import('./notes');
    const mockNote = {
      id: '1',
      title: '테스트',
      content: '<p>내용</p>',
      tags: [],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      archivedAt: null,
    };
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockNote });

    await createNote({ title: '테스트', content: '<p>내용</p>', tags: [] });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.archivedAt).toBe(null);
  });
});

describe('deleteNote', () => {
  it('DELETE 대신 PATCH 요청으로 archivedAt을 설정한다', async () => {
    vi.resetModules();
    const { deleteNote } = await import('./notes');
    const mockNote = {
      id: '1',
      title: '테스트',
      content: '',
      tags: [],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      archivedAt: '2026-05-25T10:00:00.000Z',
    };
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockNote });

    await deleteNote('1');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/notes/1',
      expect.objectContaining({ method: 'PATCH' }),
    );
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.archivedAt).toBeTruthy();
    expect(typeof body.archivedAt).toBe('string');
  });
});
