import { DrawableCanvas } from "./components/base-components/DrawableCanvas.js";
import { CopyableTextBox } from "./components/base-components/CopyableTextBox.js";

import { InviteLink } from "./components/InviteLink.js";
import { Loader } from "./components/Loader.js";
import { StackItem } from "./components/StackItem.js";
import { TimerBar } from "./components/TimerBar.js";

import { ReadyOrWaitingPrompt } from "./components/ReadyOrWaitingPrompt.js";
import { ConnectedPlayersSummary, SinglePlayerSummary } from "./components/ConnectedPlayersSummary.js";
import { CreateGameForm } from "./components/CreateGameForm.js";

import { PlayfieldWaitForOthers } from "./components/PlayfieldWaitForOthers.js";
import { PlayfieldShowScores } from "./components/PlayfieldShowScores.js";
import { PlayfieldCaption } from "./components/PlayfieldCaption.js";
import { PlayfieldPickOne } from "./components/PlayfieldPickOne.js";
import { PlayfieldDrawing } from "./components/PlayfieldDrawing.js";

Vue.config.errorHandler = function (err, vm, info) {
    console.error("Error", err, vm, info);

    try {
        rg4js('send', { error: err, customData: [{ info: info }] });
    }
    catch { }
};

Vue.component('DrawableCanvas', DrawableCanvas);
Vue.component('StackItem', StackItem);
Vue.component('TimerBar', TimerBar);
Vue.component('CopyableTextBox', CopyableTextBox);
Vue.component('InviteLink', InviteLink);
Vue.component('Loader', Loader);
Vue.component('ReadyOrWaitingPrompt', ReadyOrWaitingPrompt);
Vue.component('ConnectedPlayersSummary', ConnectedPlayersSummary);
Vue.component('SinglePlayerSummary', SinglePlayerSummary);
Vue.component('CreateGameForm', CreateGameForm);

Vue.component('PlayfieldWaitForOthers', PlayfieldWaitForOthers);
Vue.component('PlayfieldShowScores', PlayfieldShowScores);
Vue.component('PlayfieldCaption', PlayfieldCaption);
Vue.component('PlayfieldPickOne', PlayfieldPickOne);
Vue.component('PlayfieldDrawing', PlayfieldDrawing);