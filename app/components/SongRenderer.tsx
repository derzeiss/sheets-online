import { useEffect, useMemo, useState, type ChangeEvent, type FC } from 'react';
import { NOTES_SHARP } from '~/modules/chordpro-parser/constants';
import { parseSong } from '~/modules/chordpro-parser/parser';
import { transposeSong } from '~/modules/chordpro-parser/transposer';
import { lineIsComment, lineIsWithChords } from '~/modules/chordpro-parser/typeguards';
import type { Block } from '~/modules/chordpro-parser/types/Block';
import type { Note } from '~/modules/chordpro-parser/types/Note';
import type { SongLine } from '~/modules/chordpro-parser/types/SongLine';
import { useDebounce } from '~/utils/useDebounce';

interface Props {
  prosong: string;
}

export const SongRenderer: FC<Props> = ({ prosong }) => {
  const prosongDebounced = useDebounce(prosong);

  const jsong = parseSong(prosongDebounced);
  const songKey = jsong?.meta.key || 'C';

  const [songKeyTransposed, setSongKeyTransposed] = useState<Note>('C');
  const prosongTransposed = useMemo(() => {
    // transpose even if (songKey === songKeyTransposed) to transform Nashville numbers!
    return transposeSong(prosongDebounced, songKey, songKeyTransposed);
  }, [prosongDebounced, songKeyTransposed]);

  const [transposeTouched, setTransposeTouched] = useState(false);
  useEffect(() => {
    if (!transposeTouched && jsong.meta.key) setSongKeyTransposed(jsong.meta.key);
  }, [jsong.meta.key]);

  const handleTransposeChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    setSongKeyTransposed(ev.target.value as Note);
    setTransposeTouched(true);
  };

  const jsongTransposed = useMemo(() => parseSong(prosongTransposed), [prosongTransposed]);

  const metaSubhead = useMemo(() => {
    return ['key', 'tempo', 'time']
      .reduce((acc, name) => {
        const val = jsong.meta[name];
        if (val) {
          acc.push(`${name.substring(0, 1).toUpperCase() + name.substring(1)} - ${val}`);
        }
        return acc;
      }, [] as string[])
      .join(' | ');
  }, [jsong.meta.key, jsong.meta.tempo, jsong.meta.time]);

  return (
    <div>
      <div className="mb-2 text-sm">
        Key:
        <select
          className="rounded bg-neutral-100 px-2 py-1"
          value={songKeyTransposed}
          onChange={handleTransposeChange}
        >
          {NOTES_SHARP.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
          <option value="Nashville">Nashville</option>
        </select>
        <span className="ml-4">Original key: {songKey}</span>
      </div>

      {jsong && jsongTransposed ? (
        <>
          <div className="mb-6">
            <h2 className="mb-1 text-3xl font-semibold">{jsong.meta.title}</h2>
            {jsong.meta.artist && <small className="block">{jsong.meta.artist}</small>}
            {metaSubhead && (
              <small className="block">
                <strong>{metaSubhead}</strong>
              </small>
            )}
          </div>
          <div className="text-lg leading-[1.3]">
            {jsongTransposed.lines.map((line: SongLine) => {
              if (lineIsComment(line)) {
                return (
                  <strong key={line.id} className="block uppercase tracking-wide">
                    {line.content}
                  </strong>
                );
              }
              if (line.type === 'whitespace') {
                return <div key={line.id}>&nbsp;</div>;
              }
              if (lineIsWithChords(line)) {
                return (
                  <div key={line.id} className="ml-4 mt-2 flex flex-wrap gap-1">
                    {line.content.map((block: Block) => (
                      <div key={block.id} className="mr-[.2rem]">
                        <div>
                          <strong>{block.chord}&nbsp;</strong>
                        </div>
                        <div>{block.text}</div>
                      </div>
                    ))}
                  </div>
                );
              }
              return (
                <div key={line.id} className="ml-4">
                  {line.content as string}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="italic text-neutral-600">Enter a song to start</div>
      )}

      <pre className="overflow-auto">{JSON.stringify(jsong, null, 2)}</pre>
    </div>
  );
};
