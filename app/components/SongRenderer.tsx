import { useMemo, type FC } from 'react';
import { parseSong } from '~/modules/chordpro-parser/parser';
import { transposeSong } from '~/modules/chordpro-parser/transposer';
import { lineIsComment, lineIsWithChords } from '~/modules/chordpro-parser/typeguards';
import type { Block } from '~/modules/chordpro-parser/types/Block';
import type { Note } from '~/modules/chordpro-parser/types/Note';
import type { SongLine } from '~/modules/chordpro-parser/types/SongLine';
import { useDebounce } from '~/utils/useDebounce';

interface Props {
  prosong: string;
  targetKey: Note;
}

export const SongRenderer: FC<Props> = ({ prosong, targetKey }) => {
  const prosongDebounced = useDebounce(prosong);
  const jsong = useMemo(() => parseSong(prosongDebounced), [prosongDebounced]);

  const prosongTransposed = useMemo(
    // transpose even if (songKey === songKeyTransposed) to transform Nashville numbers!
    () => transposeSong(prosongDebounced, jsong.meta.key, targetKey),
    [prosongDebounced, targetKey],
  );
  const jsongTransposed = useMemo(() => parseSong(prosongTransposed), [prosongTransposed]);

  const metaSubhead = useMemo(() => {
    const metaWithTargetKey: typeof jsong.meta = {
      ...jsong.meta,
      original: jsong.meta.key,
      key: targetKey,
    };
    return ['key', 'original', 'tempo', 'time']
      .reduce((acc, name) => {
        const val = metaWithTargetKey[name];
        if (val) {
          acc.push(`${name.substring(0, 1).toUpperCase() + name.substring(1)} - ${val}`);
        }
        return acc;
      }, [] as string[])
      .join(' | ');
  }, [jsong.meta.key, jsong.meta.tempo, jsong.meta.time, targetKey]);

  if (!prosong || !jsong || !jsongTransposed)
    return <div className="italic text-neutral-600">Enter a song to start</div>;

  return (
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
      <div className="whitespace-pre text-lg leading-[1.3] tracking-[.015em]">
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
              <div key={line.id} className="ml-4 mt-2 flex flex-wrap">
                {line.content.map((block: Block) => (
                  <div key={block.id}>
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
      {/* <pre>{JSON.stringify(jsong, null, 2)}</pre> */}
    </>
  );
};
