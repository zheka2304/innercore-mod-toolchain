/// <reference path="./innercore.d.ts"/>

/**
 * @returns PreloaderAPI level, default is 1
 */
declare function getAPILevel(): number

/**
 * Writes message to the log, using specified log prefix
 * Prefix of the message = PRELOADER
 * @param message message to be logged
*/
declare function log(message: string): void

/**
 * Show toast with text message
 * And writes message to the log, using specified log prefix
 * Prefix of the message = PRELOADER-PRINT
 * @param message message to be logged
*/
declare function print(str: string): void


declare namespace Resources {

	function addRuntimePack(typeStr: string, name: string): string

	function getAllResourceDirectories(): string[]

	function getAllResourceDirectoriesPaths(): string[]

	function searchFilesInDir(result: Array<string>, baseDir: java.io.File, file: java.io.File, regex: string): void

	function getAllMatchingResourcesInDir(_directory: Object, regex: string): string[]

	function getAllMatchingResourcesInPath(_directory: Object, regex: string): string[]

	function getAllMatchingResources(regex: string): string[]

	function getResourcePathNoVariants(path: string): java.io.File | null

	function getResourcePath(path: string): string | null

}

declare namespace Callback {

	/**
	 * Adds callback function for the specified callback name. Most of native
	 * events can be prevented using [[Game.prevent]] call.
	 * @param name callback name, should be one of the pre-defined or a custom
	 * name if invoked via [[Callback.invokeCallback]]
	 * @param func function to be called when an event occures
	 */
	function addCallback(name: string, func: Function, priority: number): void

	/**
	 * Invokes callback with any name and up to 10 additional parameters. You
	 * should not generally call pre-defined callbacks until you really need to
	 * do so. If you want to trigger some event in your mod, use your own
	 * callback names
	 * @param name callback name
	 */
	function invokeCallback(name: string, o1?: any, o2?: any, o3?: any, o4?: any, o5?: any, o6?: any, o7?: any, o8?: any, o9?: any, o10?: any): void

}
