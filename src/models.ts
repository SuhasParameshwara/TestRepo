import { CommandLineOptions } from "command-line-args";

export interface CommandDefaultOptions extends CommandLineOptions {
    apiKey?: string;
    apihubUrl?: string;
}

export interface ImportCommandOptions extends CommandDefaultOptions {
    versionId: string;
    path: string;
}

export interface ResyncCommandOptions extends CommandDefaultOptions {
    apiReferenceId: string;
    path: string;
}

export interface EnvironmentConfig {
    apiKey: string;
    apihubUrl: string;
}

export interface CommandCategoryDetails {
    commandCategoryName: string;
    decsription: string;
    commands: Command[];
}

export interface Command {
    name: string;
    description: string;
}

export enum ApiReferenceSourceType {
    URL,
    FileUpload,
    CommandLine
}

export enum ApiReferenceOperationType {
    Import,
    Update,
    Resync
}

