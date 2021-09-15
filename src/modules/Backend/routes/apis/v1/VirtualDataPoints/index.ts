function vdpsGetHandler (): void{}
function vdpsPostHandler (): void{}
function vdpGetHandler (): void{}
function vdpDeleteHandler (): void{}
function vdpPatchHandler (): void{}

module.exports = {
    vdpsGet: vdpsGetHandler,
    vdpsPost: vdpsPostHandler,
    vdpGet: vdpGetHandler,
    vdpDelete: vdpDeleteHandler,
    vdpPatch: vdpPatchHandler
}