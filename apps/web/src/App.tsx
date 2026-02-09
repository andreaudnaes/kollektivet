import { FormEvent, useMemo, useState } from 'react';

type Page = 'home' | 'cleaning';
type Rotation = 'weekly' | 'biweekly';

type Member = {
  id: string;
  name: string;
};

type Area = {
  id: string;
  title: string;
  memberIds: string[];
  assignedTo: string | null;
};

const rotationLabel: Record<Rotation, string> = {
  weekly: 'Hver uke',
  biweekly: 'Annenhver uke',
};

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function App() {
  const [page, setPage] = useState<Page>('home');
  const [rotation, setRotation] = useState<Rotation>('weekly');
  const [members, setMembers] = useState<Member[]>([
    { id: crypto.randomUUID(), name: 'Andrea' },
    { id: crypto.randomUUID(), name: 'Magnus' },
  ]);
  const [areas, setAreas] = useState<Area[]>([
    {
      id: crypto.randomUUID(),
      title: 'Kjøkken',
      memberIds: [],
      assignedTo: null,
    },
    {
      id: crypto.randomUUID(),
      title: 'Bad',
      memberIds: [],
      assignedTo: null,
    },
  ]);
  const [newMember, setNewMember] = useState('');
  const [newArea, setNewArea] = useState('');

  const memberMap = useMemo(
    () => new Map(members.map((member) => [member.id, member.name])),
    [members]
  );
  const nextRotationDate = useMemo(
    () => addDays(new Date(), rotation === 'weekly' ? 7 : 14).toLocaleDateString('nb-NO'),
    [rotation]
  );

  const handleAddMember = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = newMember.trim();
    if (!trimmed) {
      return;
    }

    setMembers((current) => [...current, { id: crypto.randomUUID(), name: trimmed }]);
    setNewMember('');
  };

  const handleAddArea = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = newArea.trim();
    if (!trimmed) {
      return;
    }

    setAreas((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        title: trimmed,
        memberIds: [],
        assignedTo: null,
      },
    ]);
    setNewArea('');
  };

  const toggleMemberForArea = (areaId: string, memberId: string) => {
    setAreas((current) =>
      current.map((area) => {
        if (area.id !== areaId) {
          return area;
        }

        const exists = area.memberIds.includes(memberId);
        const memberIds = exists
          ? area.memberIds.filter((id) => id !== memberId)
          : [...area.memberIds, memberId];

        const assignedTo = memberIds.includes(area.assignedTo ?? '') ? area.assignedTo : null;
        return { ...area, memberIds, assignedTo };
      })
    );
  };

  const setAreaAssignment = (areaId: string, memberId: string) => {
    setAreas((current) =>
      current.map((area) => (area.id === areaId ? { ...area, assignedTo: memberId } : area))
    );
  };

  const rotateNow = () => {
    setAreas((current) =>
      current.map((area) => {
        if (area.memberIds.length === 0) {
          return { ...area, assignedTo: null };
        }

        if (!area.assignedTo || !area.memberIds.includes(area.assignedTo)) {
          return { ...area, assignedTo: area.memberIds[0] };
        }

        const currentIndex = area.memberIds.indexOf(area.assignedTo);
        const nextIndex = (currentIndex + 1) % area.memberIds.length;
        return { ...area, assignedTo: area.memberIds[nextIndex] };
      })
    );
  };

  if (page === 'home') {
    return (
      <main className="min-h-screen p-8">
        <section className="mx-auto max-w-2xl space-y-4">
          <h1 className="text-3xl font-semibold">Kollektiv app</h1>
          <p className="text-slate-600">
            En app som gjør samarbeidet i et kollektiv enklere og mer oversiktlig.
          </p>
          <ul className="list-disc pl-5 text-slate-700">
            <li>Handleliste</li>
            <li>Kalender</li>
            <li>Vaskeliste</li>
            <li>Beholdning</li>
          </ul>
          <button
            type="button"
            onClick={() => setPage('cleaning')}
            className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700"
          >
            Åpne vaskeliste
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto max-w-3xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold">Vaskeliste</h1>
          <button
            type="button"
            onClick={() => setPage('home')}
            className="rounded-md border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100"
          >
            Tilbake til forsiden
          </button>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Rotasjon</h2>
          <p className="mt-1 text-slate-600">Velg hvor ofte lista skal rotere.</p>
          <div className="mt-3 flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="rotation"
                checked={rotation === 'weekly'}
                onChange={() => setRotation('weekly')}
              />
              Hver uke
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="rotation"
                checked={rotation === 'biweekly'}
                onChange={() => setRotation('biweekly')}
              />
              Annenhver uke
            </label>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Nåværende valg: <strong>{rotationLabel[rotation]}</strong>. Neste foreslåtte bytte:{' '}
            {nextRotationDate}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <form
            onSubmit={handleAddMember}
            className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">Beboere</h2>
            <div className="flex gap-2">
              <input
                value={newMember}
                onChange={(event) => setNewMember(event.target.value)}
                placeholder="Skriv inn navn"
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              />
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700"
              >
                Legg til
              </button>
            </div>
            <ul className="space-y-2">
              {members.map((member) => (
                <li key={member.id} className="rounded bg-slate-100 px-3 py-2 text-slate-800">
                  {member.name}
                </li>
              ))}
            </ul>
          </form>

          <form
            onSubmit={handleAddArea}
            className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">Ansvarsområder</h2>
            <div className="flex gap-2">
              <input
                value={newArea}
                onChange={(event) => setNewArea(event.target.value)}
                placeholder="F.eks. Gang eller Stue"
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              />
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700"
              >
                Legg til
              </button>
            </div>
            <p className="text-sm text-slate-600">
              Du kan fordele ulike personer på kjøkken, bad og andre områder.
            </p>
          </form>
        </div>

        <div className="space-y-4">
          {areas.map((area) => (
            <article key={area.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{area.title}</h3>
              <p className="mt-1 text-sm text-slate-600">Velg hvem som kan rotere på dette området.</p>
              <div className="mt-3 flex flex-wrap gap-4">
                {members.map((member) => (
                  <label key={member.id} className="flex items-center gap-2 text-slate-700">
                    <input
                      type="checkbox"
                      checked={area.memberIds.includes(member.id)}
                      onChange={() => toggleMemberForArea(area.id, member.id)}
                    />
                    {member.name}
                  </label>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <label htmlFor={`assigned-${area.id}`} className="text-sm text-slate-700">
                  Ansvarlig nå:
                </label>
                <select
                  id={`assigned-${area.id}`}
                  value={area.assignedTo ?? ''}
                  onChange={(event) => setAreaAssignment(area.id, event.target.value)}
                  className="rounded-md border border-slate-300 px-3 py-2"
                >
                  <option value="">Velg person</option>
                  {area.memberIds.map((memberId) => (
                    <option key={memberId} value={memberId}>
                      {memberMap.get(memberId)}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-slate-600">
                  {area.assignedTo ? `Nå: ${memberMap.get(area.assignedTo)}` : 'Ingen valgt enda'}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={rotateNow}
            className="rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-500"
          >
            Roter liste nå
          </button>
          <p className="text-sm text-slate-600">
            Flytter ansvarlig til neste person i hvert område.
          </p>
        </div>
      </section>
    </main>
  );
}
