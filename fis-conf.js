fis.media('pro').hook('del', {
    dir: ['./dist']
});

fis.hook('relative');


fis.set('project.ignore',['dist'])

fis.match("**",{
    release:false,
})
fis.match('/less/(amazeui.areaselect.less)', {
    parser: fis.plugin('less2'),
    rExt: '.css',
    release: '$1',
    postprocessor: fis.plugin("autoprefixer", {
        "browsers": ["last 3 versions"]
    })
});
fis.match('/lib/(amazeui.areaselect.js) ',{
    parser: fis.plugin('babel-5.x'),
    release: '$1',
})
// fis.match('/node_modules/jquery/dist/(jquery.min.js)',{
//     release: '$1',    
// })
// fis.match('/node_modules/amazeui/dist/css/(amazeui.min.css)',{
//     release: '$1',    
//      relative: true
// })
// fis.match('/node_modules/amazeui/dist/js/(amazeui.min.js)',{
//     release: '$1',    
// })

// fis.match('/node_modules/amazeui/dist/(fonts/*)',{
//     release: '$1',    
    
//     relative: true
// })