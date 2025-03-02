import { signal, Signal, untracked } from '@angular/core';
import { Person, Resource, ResourceList } from './models';

export const apiURL = 'https://swapi.dev/api/';

export function readonlyArray<T>(values: T[]): readonly T[] {
  return values;
}

export async function fetchResource<T>(
  url: URL | null,
): Promise<T | undefined> {
  if (url !== null) {
    const res = await fetch(url);
    const json = await res.json();

    if (res.ok) {
      return json;
    }
  }

  return undefined;
}

export function resourceSignal<T>(
  url: URL | null,
): Signal<T | null | undefined>;

export function resourceSignal<T, R>(
  url: URL | null,
  tranform: (value: T) => R | Promise<R>,
): Signal<T | null | undefined>;

export function resourceSignal<T, R>(
  url: URL | null,
  tranform?: (value: T) => R | Promise<R>,
): Signal<T | null | undefined> {
  return untracked(() => {
    const resource = signal<T | null | undefined>(undefined);

    (async () => {
      if (url !== null) {
        const res = await fetch(url);
        const json = await res.json();

        if (res.ok) {
          return resource.set(tranform ? await tranform(json) : json);
        }
      }

      return resource.set(null);
    })();

    return resource.asReadonly();
  });
}

export function parseResource(resource: Resource) {
  const { url, created, edited } = resource;
  const id = `swapi${url
    .slice(apiURL.length)
    .split('/')
    .filter((path) => !!path)
    .join('/')}`;

  return {
    ...resource,
    id,
    url: new URL(url),
    created: new Date(created),
    edited: new Date(edited),
  } as const;
}

function parseGenericResourceList<T extends Resource>(
  resourceList: ResourceList<T>,
) {
  const { previous, next } = resourceList;
  return {
    ...resourceList,
    previous: previous != null ? new URL(previous) : null,
    next: next !== null ? new URL(next) : null,
  } as const;
}
export function parseResourceList(resourceList: ResourceList<Resource>) {
  const parsedResourceList = parseGenericResourceList(resourceList);
  const { previous, next } = resourceList;
  return {
    ...resourceList,
    previous: previous != null ? new URL(previous) : null,
    next: next !== null ? new URL(next) : null,
  } as const;
}

export function parsePerson(resource: Person) {
  const { homeworld, films, species, starships, vehicles } = resource;
  return {
    ...resource,
    ...parseResource(resource),
    homeworld: homeworld !== null ? new URL(homeworld) : null,
    films: readonlyArray(films.map((url) => new URL(url))),
    species: readonlyArray(species.map((url) => new URL(url))),
    starships: readonlyArray(starships.map((url) => new URL(url))),
    vehicles: readonlyArray(vehicles.map((url) => new URL(url))),
  } as const;
}

export function parsePersonList(resourceList: ResourceList<Person>) {
  const parsedResourceList = parseGenericResourceList(resourceList);
  const { results } = parsedResourceList;
  return {
    ...parsedResourceList,
    results: readonlyArray(results.map(parsePerson)),
  } as const;
}
