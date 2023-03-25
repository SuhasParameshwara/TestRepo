import prompts from 'prompts';
import importFlow from '../../api/apidocs/import';
import findOasFilesInCurrentDirectory from '../../api/initOas';
import { CommandCategories } from '../../constants';
import { isCI } from '../../helper/isCI';
import terminalWrapper from '../../helper/terminalWrapper';
import { ImportCommandOptions } from "../../models";
import BaseCommand from "../baseCommand";

export default class APIDocsCommand extends BaseCommand {

    constructor() {
        super();
        this.args = [
            {
                name: "apiKey",
                type: String,
                description: "Your apikey"
            },
            {
                name: "apihubUrl",
                type: String,
                description: "Enter the apihub url"
            },
            {
                name: "versionId",
                type: String,
                description: "API documentation project version Id",
            },
            {
                name: "path",
                type: String,
                description: "File path"
            }
        ]
        this.command = "apidocs";
        this.description = "Import your OpenAPI definition to Document360";
        this.commandCategory = CommandCategories.apidocs;
        this.usage = "apidocs [options]";
    }
    async run(options: ImportCommandOptions): Promise<string> {
        await super.run(options);
        if (!isCI()) {
            if (!options.versionId) {
                const versionIdAnswer = await terminalWrapper([
                    {
                        type: 'text',
                        name: 'versionId',
                        message: 'Enter your version id',
                    }
                ]);
                options.versionId = versionIdAnswer.versionId;
            }
            if (!options.path) {
                options.path = await findOasFilesInCurrentDirectory();
            }
        }
        else {
            if(!options.path){
                options.path = await findOasFilesInCurrentDirectory();
            }
            if (!options.versionId && !options.path)
                throw new Error("Require parameters versionId and path not found. Please provide --versionId and --path");
            if (!options.versionId)
                throw new Error("versionId parameter not found. Please provide --versionId");
            if (!options.path)
                throw new Error("path parameter not found. Please provide --parameter");
        }
        prompts.override(options);
        const response = await importFlow(options);
        return Promise.resolve("");
    }
}