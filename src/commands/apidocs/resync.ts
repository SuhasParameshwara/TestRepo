import prompts from "prompts";
import resyncFlow from "../../api/apidocs/resync";
import findOasFilesInCurrentDirectory from "../../api/initOas";
import { CommandCategories } from "../../constants";
import { isCI } from "../../helper/isCI";
import terminalWrapper from "../../helper/terminalWrapper";
import { ResyncCommandOptions } from "../../models";
import BaseCommand from "../baseCommand";

export default class ResyncCommand extends BaseCommand {
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
                description: "Project Document Version Id",
            },
            {
                name: "apiReferenceId",
                type: String,
                description: "API Reference Id",
            },
            {
                name: "path",
                type: String,
                description: "File path"
            }
        ]
        this.command = "apidocs:resync";
        this.description = "Resync your OpenAPI definition to Document360";
        this.commandCategory = CommandCategories.apidocs;
        this.usage = "apidocs:resync [options]";
    }
    async run(options: ResyncCommandOptions): Promise<string> {
        await super.run(options);
        if (isCI()) {
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
                const pathAnswer = await terminalWrapper([
                    {
                        type: 'text',
                        name: 'path',
                        message: 'Enter the file path',
                    }
                ]);
                options.path = pathAnswer.path;
            }
        }
        else {
            options.path = await findOasFilesInCurrentDirectory();
            if (!options.versionId && !options.path)
                throw new Error("Require parameters versionId and path not found. Please provide --versionId and --path");
            if (!options.versionId)
                throw new Error("versionId parameter not found. Please provide --versionId");
            if (!options.path)
                throw new Error("path parameter not found. Please provide --parameter");
        }
        prompts.override(options);
        const response = await resyncFlow(options);
        return Promise.resolve("");
    }
}