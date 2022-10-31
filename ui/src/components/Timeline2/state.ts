import { Entity } from '@alephdata/followthemoney';

type TimelineEntity = Omit<Entity, 'getTemporalStart'> & {
  getTemporalStart: () => NonNullable<ReturnType<Entity['getTemporalStart']>>;
};

type Vertex = {
  color?: string;
  entityId: string;
};

type Layout = {
  vertices: Array<Vertex>;
};

type State = {
  entities: Array<Entity>;
  layout: Layout;
  selectedId: string | null;
};

type SelectEntityAction = {
  type: 'SELECT_ENTITY';
  payload: {
    entity: Entity;
  };
};

type UpdateVertexAction = {
  type: 'UPDATE_VERTEX';
  payload: {
    vertex: Vertex;
  };
};

type UpdateEntityAction = {
  type: 'UPDATE_ENTITY';
  payload: {
    entity: Entity;
  };
};

type Action = SelectEntityAction | UpdateVertexAction | UpdateEntityAction;

const reducer = (state: State, { type, payload }: Action): State => {
  if (type === 'SELECT_ENTITY') {
    return { ...state, selectedId: payload.entity.id };
  }

  if (type === 'UPDATE_VERTEX') {
    const vertices = state.layout.vertices;
    const index = state.layout.vertices.findIndex(
      (vertex) => vertex.entityId === payload.vertex.entityId
    );

    if (index < 0) {
      vertices.push(payload.vertex);
    } else {
      vertices.splice(index, 1, payload.vertex);
    }

    return { ...state, layout: { vertices } };
  }

  if (type === 'UPDATE_ENTITY') {
    const index = state.entities.findIndex(
      (entity) => entity.id === payload.entity.id
    );

    if (index < 0) {
      state.entities.push(payload.entity);
    } else {
      state.entities.splice(index, 1, payload.entity);
    }

    return { ...state, entities: state.entities };
  }

  throw new Error('Invalid action type.');
};

const selectSelectedEntity = (state: State): Entity | null =>
  state.entities.find((entity) => entity.id === state.selectedId) || null;

const selectSelectedVertex = (state: State): Vertex | null => {
  const entity = selectSelectedEntity(state);

  if (!entity) {
    return null;
  }

  const defaultVertex = { entityId: entity.id };

  return (
    state.layout.vertices.find((vertex) => vertex.entityId === entity.id) ||
    defaultVertex
  );
};

const selectSortedEntities = (state: State): Array<Entity> => {
  return state.entities
    .filter(
      (entity): entity is TimelineEntity => entity.getTemporalStart() !== null
    )
    .sort((a, b) => {
      const aStart = a.getTemporalStart().value;
      const bStart = b.getTemporalStart().value;

      return aStart.localeCompare(bStart);
    });
};

export type { State, Action };
export {
  reducer,
  selectSortedEntities,
  selectSelectedEntity,
  selectSelectedVertex,
};
