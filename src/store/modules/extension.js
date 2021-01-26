export default {
  namespaced: true,
  state: {
    dialogInstall: false,
  },
  mutations: {
    openInstallDialog: (state) => state.dialogInstall = true,
    closeInstallDialog: (state) => state.dialogInstall = false,
  },
}
