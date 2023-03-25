import prompts from 'prompts';

export default async function terminalWrapper<T extends string = string>(
    questions: prompts.PromptObject<T> | prompts.PromptObject<T>[],
    options?: prompts.Options
): Promise<prompts.Answers<T>> {
    const onCancel = () => {
        process.stdout.write('\n');
        process.stdout.write('Thanks for using d360! See you soon ✌️');
        process.stdout.write('\n\n');
        process.exit(1);
    };

    function onRender() {
        // process.stdout.write('\n');
        // process.stdout.write(
        //     'Yikes! Looks like we were about to prompt you for something in a CI environment. Are you missing an argument?'
        // );
        // process.stdout.write('\n\n');
        // process.stdout.write('Try running `d360 <command> --help` or get in touch at support@document360.io.');
        // process.stdout.write('\n\n');
        // process.exit(1);
    }

    if (Array.isArray(questions)) {
        questions = questions.map(question => ({ onRender, ...question }));

    } else {
        questions.onRender = onRender;
    }

    return prompts(questions, { onCancel, ...options });

}