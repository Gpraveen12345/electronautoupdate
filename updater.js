const{autoUpdater}=require('electron-updater')
const{dialog,BrowserWindow,ipcMain}=require('electron')
autoUpdater.logger=require('electron-log')
autoUpdater.logger.transports.file.level='info'
autoUpdater.autoDownload=false
let downloadprogress=0

exports.check=()=>{

console.log("checking for updates")
autoUpdater.checkForUpdates()
autoUpdater.on('update-available',()=>{
dialog.showMessageBox({
    type:'info',
    title:"update available",
    message:'a newer version of readit is available do you want to download it?  ',
    buttons:['update','no']
},(buttonIndex)=>{
    if(buttonIndex !=0) return
    autoUpdater.downloadUpdate()
    let progresswin =new BrowserWindow({
        width:350,
        height:35,
        useContentSize:true,
        autoHideMenuBar:true,
        maximizeable:false,
        fullscreen:false,
        fullscreenable:false,
        resizeable:false
    })
    progresswin.loadURL('file://${__dirname}/renderer/progess.html')
    progresswin.on('closed',()=>{
        progresswin=null
    })
    ipcMain.on('download-progess-request',()=>{
        e.returnValue=downloadprogress
    })
    autoUpdater.on('download-progress',(d)=>{
        downloadprogress=d.percent
    })
    autoUpdater.on('update-downloaded',()=>{
        if(progresswin)progresswin.close()
        dialog.showMessageBox({
            type:'info',
            title:"update ready",
            message:'a newer version of readit is ready .quite and  install now',
            buttons:['yes','Later']
        },(buttonIndex)=>{
            if(buttonIndex==0)autoUpdater.quitAndInstall()
        })
    })

})
})
}