import fs from 'fs';
export default function readDirectory(currentFolder: string, files: string[] = []): string[] {
    const items = fs.readdirSync(currentFolder, { withFileTypes: true });
    for (const item of items) {
        console.log(item.name);
        if (item.isDirectory()) {
            files = [...files, ...readDirectory(`${currentFolder}/${item.name}`, files)];
        } else  {
            files.push(`${currentFolder}/${item.name}`);
        }
    }
    return files;
}