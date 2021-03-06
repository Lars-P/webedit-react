// @flow
import { handleActions } from 'redux-actions';
import { type List, Map } from 'immutable';

export type Animation = {
  id: string,
  delay?: number,
  repeat?: number,
  direction?: 0 | 1,
  name: string,
  speed?: number,
  text: string,
  creationDate: number,
  type: 'text' | 'pixel',
  animation: {
    length: number,
    currentFrame: number,
    frames: number,
    data: List<number>,
  },
};

export type State = {
  animations: Map<string, Animation>,
  selectedAnimation: ?Animation,
};

const savedAnimations = localStorage.getItem('animations');
let initialAnimations = Map();

if (savedAnimations) {
  try {
    initialAnimations = Map(JSON.parse(savedAnimations));
  } catch (e) {
    localStorage.removeItem('animations');
  }
}

const initialState: State = {
  animations: initialAnimations,
  selectedAnimation: undefined,
};

export default handleActions(
  {
    ADD_ANIMATION: (state: State, { payload }) => {
      const animations = state.animations.set(payload.id, payload);

      localStorage.setItem('animations', JSON.stringify(animations.toJSON()));

      return {
        animations,
        selectedAnimation: payload,
      };
    },
    SELECT_ANIMATION: (state: State, { payload }) => ({
      ...state,
      selectedAnimation: payload,
    }),
    UPDATE_ANIMATION: (state: State, { payload }) => {
      const animations = state.animations.set(payload.id, payload);

      localStorage.setItem('animations', JSON.stringify(animations.toJSON()));

      return {
        animations,
        selectedAnimation:
          state.selectedAnimation && state.selectedAnimation.id === payload.id ? payload : state.selectedAnimation,
      };
    },
    REMOVE_ANIMATION: (state: State, { payload }) => {
      if (!state.animations.has(payload)) {
        return state;
      }
      const animations = state.animations.remove(payload);

      localStorage.setItem('animations', JSON.stringify(animations.toJSON()));

      return {
        animations,
        selectedAnimation:
          state.selectedAnimation && state.selectedAnimation.id === payload ? undefined : state.selectedAnimation,
      };
    },
    RESET: () => {
      localStorage.removeItem('animations');

      return {
        animations: Map(),
        selectedAnimation: undefined,
      };
    },
  },
  initialState
);
