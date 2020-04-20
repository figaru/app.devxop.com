// Import client startup through a single index entry point


/* import './home.routes.js'; */
import './routes/groups.js';

//EXPOSED ROUTES
import './routes/landing.exposed.js';
import './routes/auth.exposed.js';

/* LAYOUTS */
import '../../ui/pages/not-found/not-found.js';
import '../../ui/layouts/exposed/exposed.layout.js';
import '../../ui/layouts/user/user.layout.js';

/* USER ROUTES */
import './routes/dashboard.user.js';
import './routes/devices.user.js';
import './routes/media.user.js';

/* PAGES */
//import "../../ui/pages/user/media/media.js";

import "../../ui/pages/index";

//FUNCTIONS
import '../../ui/functions/console.js';
import '../../ui/functions/listeners.js';

//UTILS
import '../../ui/functions/utils/index.utils.js';

//HELPERS
import '../../ui/helpers/router.helper.js';

//COMPONENTS
import '../../ui/components/img/img.js';
import '../../ui/components/files/select.files.js';
import '../../ui/components/form/text.input.js';
import '../../ui/components/form/dropdown.input.js';
import '../../ui/components/form/progress.input.js';


import ElementQueries from 'css-element-queries/src/ElementQueries';
import { ReactiveVar } from 'meteor/reactive-var';

$(() => {

  // attaches to DOMLoadContent and does anything for you
  ElementQueries.listen();

  // or if you want to trigger it yourself:
  // 'init' parses all available CSS and attach ResizeSensor to those elements which
  // have rules attached (make sure this is called after 'load' event, because
  // CSS files are not ready when domReady is fired.
  ElementQueries.init();
})



/* FlowRouter.wait();

Tracker.autorun(() => {
    // # if the roles subscription is ready, start routing
  // # there are specific cases that this reruns, so we also check
  // # that FlowRouter hasn't initalized already

  if(Roles.subscription.ready() && FlowRouter._initialized){
    FlowRouter.initialize()
  }
}) */