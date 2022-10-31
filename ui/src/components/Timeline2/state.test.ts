import { Model, defaultModel } from '@alephdata/followthemoney';
import { reducer, State } from './state';

const model = new Model(defaultModel);
const entity = model.getEntity({
  id: '123',
  schema: 'Event',
});

let state: State;

beforeEach(() => {
  state = {
    entities: [entity],
    layout: { vertices: [] },
    selectedId: null,
  };
});

describe('SELECT_ENTITY', () => {
  it('updates selected entity ID', () => {
    const newState = reducer(state, {
      type: 'SELECT_ENTITY',
      payload: { entity },
    });

    expect(newState.selectedId).toEqual('123');
  });
});

describe('UPDATE_VERTEX', () => {
  it('appends vertex if none exists', () => {
    const vertex = {
      entityId: '123',
      color: 'pink',
    };

    const newState = reducer(state, {
      type: 'UPDATE_VERTEX',
      payload: { vertex },
    });

    expect(newState.layout.vertices).toHaveLength(1);
    expect(newState.layout.vertices[0]).toEqual({
      entityId: '123',
      color: 'pink',
    });
  });

  it('updates existing vertex', () => {
    state.layout.vertices.push({
      entityId: '123',
      color: 'blue',
    });

    const vertex = {
      entityId: '123',
      color: 'pink',
    };

    const newState = reducer(state, {
      type: 'UPDATE_VERTEX',
      payload: { vertex },
    });

    expect(newState.layout.vertices).toHaveLength(1);
    expect(newState.layout.vertices[0]).toEqual({
      entityId: '123',
      color: 'pink',
    });
  });
});

describe('UPDATE_ENTITY', () => {
  it('appends entity if it does not yet exist', () => {
    const entity = model.getEntity({
      id: 'abc',
      schema: 'Event',
    });

    const newState = reducer(state, {
      type: 'UPDATE_ENTITY',
      payload: { entity },
    });

    expect(newState.entities).toHaveLength(2);
    expect(newState.entities[1]).toEqual(entity);
  });

  it('updates existing entity', () => {
    const entity = model.getEntity({
      id: '123',
      schema: 'Event',
      properties: {
        name: ['New event name'],
      },
    });

    const newState = reducer(state, {
      type: 'UPDATE_ENTITY',
      payload: { entity },
    });

    expect(newState.entities).toHaveLength(1);
    expect(newState.entities[0].getProperty('name')).toEqual([
      'New event name',
    ]);
  });
});
