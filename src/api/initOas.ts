
import ora from 'ora';
import { isCI } from '../helper/isCI';
import readDirectory from '../helper/readDirectory';
import terminalWrapper from '../helper/terminalWrapper';
export default async function findOasFilesInCurrentDirectory(
) {
    const isFindingFiles = ora({ text: 'Looking for API Definitions files..' }).start();

    const oasSpecFies = readDirectory(".").filter(file => file.endsWith(".json") || file.endsWith(".yaml"));
    isFindingFiles.stop();
    console.log("func called");
    if (!isCI()) {
        const selectedFile = await terminalWrapper({
            name: 'file',
            message: 'asdasd',
            type: 'select',
            choices: oasSpecFies.map(file => ({
                title: file,
                value: file,
            }))
        });
        return selectedFile.file;
    }
    else {
        if (oasSpecFies.length > 1)
            throw new Error('Multiple API definitions found in current directory. Please specify file.');
    }
    return oasSpecFies[0];
}