declare function LIBRARY(description: object): void;
declare function EXPORT(name: string, lib: any): void;

declare namespace ModAPI {
	function requireGlobal(name: string): any;
}