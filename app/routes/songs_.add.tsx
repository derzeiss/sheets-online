import { useState } from 'react';
import { SongRenderer } from '~/components/SongRenderer';

const songBlueprint = `{title: }
{artist: }
{key: }
{time: 4/4}

{comment: Verse 1}

{comment: Chorus}

{comment: Bridge}`;

export default function SongsAdd() {
  const [prosong, setProsong] = useState(songBlueprint);

  return (
    <main className="container my-10">
      <h1 className="text-5xl">Add Song</h1>
      <div className="mt-8 grid grid-cols-2 gap-12">
        <div>
          <textarea
            className="h-[calc(100vh-14rem)] w-full rounded-lg border border-neutral-300 p-4"
            value={prosong}
            onChange={(ev) => setProsong(ev.target.value)}
          ></textarea>
          <button className="clickable inline-block rounded bg-neutral-100 px-4 py-2">Save</button>
        </div>
        <SongRenderer prosong={prosong} />
      </div>
    </main>
  );
}
