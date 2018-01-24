declare var ssgDoc: any;
Handlebars.registerHelper('description', function (block: any) {

    let description = '',
        markdownKey = block.data.root.baseFilter + '_' + block.data.root.filename;

    if (ssgDoc[markdownKey] !== undefined) {

        description = ssgDoc[markdownKey].body;

        return new Handlebars.SafeString(description);

    } else {
        // description = block.data.root.description;
        return block.data.root.description;
    }
})
