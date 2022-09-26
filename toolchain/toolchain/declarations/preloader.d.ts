/// <reference path="./adapted-script.d.ts"/>

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
