interface MutationType {
  SET_RESULT: string
}

export const mutationType: MutationType = {
  SET_RESULT: 'SET_RESULT'
}

export const state: () => any = (): any => ({
  result: null
})

export const mutations = {
  [mutationType.SET_RESULT](state, result): void {
    state.result = result
  }
}

export const getters = {
  faceAnnotations(state): any {
    if (!state.result) return {}

    return state.result.faceAnnotations[0]
  },
  boundingVertices(state, getters): any {
    return getters.faceAnnotations.boundingPoly.vertices
  }
}
