# Circleup



# firebase

    ⁕ deployment
        1. navigate to firebase folder
            cd firebase
        2. deploy to forebase
            firebase deploy 


# caapsitor
    
    ⁕ apk creation
        1. sync capasitor changes if any
            npx cap sync
        2. open android studion
            npx cap open android
        3. build apk from
            build >> Generate App Bundles or APKs >> Generate APKs
        4 go to
            D:\Projects\frontend\circleup\android\app\build\outputs\apk\debug

    ⁕ Splash screen
        1. generate splash screen inage
            npx @capacitor/assets generate --android
        2. sync capasitor changes 
            npx cap sync
    
    ⁕ Splash screen and icon
        1. added splash.png and icon.png in resources folder and run
            npx capacitor-assets generate
        2. sync capasitor changes 
            npx cap sync




toogle
<label class="neo-toggle m-0 p-0">
    <input formControlName="isImageLink" type="checkbox" id="isImageLink" />
    <span class="track">
        <span class="thumb"></span>
    </span>
</label>