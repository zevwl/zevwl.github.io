const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Client ID and API key from the Developer Console
const CLIENT_ID = '386995823516-i8d3rcanc4ic1pruofj7gnb2oa73njag.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'];

// Authorization scopes required by the API, multiple scopes can be
// included, sparated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

const authorizeButton = $('#authorize-button');
const signoutButton = $('#signout-button');

/**
 * On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 * Initializes the API client library and sets up sign-in state listeners.
 */
function initClient() {
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    clientId: CLIENT_ID,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  });
}

/**
 * Called when the signedd in status changes, to update hte UI
 * appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    listLabels();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

/**
 * Sin in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 * Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre eleemnt.
 */
function appendPre(message) {
  const pre = $('#content');
  const textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

/**
 * Print all Labels in the authorized user's inbox. If no labels
 * are found an appropriate message is printed.
 */
async function listLabels() {
  gapi.client.gmail.users.labels.list({
    'userId': 'me'
  }).then(response => {
    const labels = response.result.labels;
    appendPre('Labels:');

    let myTotal = 0;
    if (labels && labels.length > 0) {
      labels.forEach(label => {
        gapi.client.gmail.users.labels.get({'userId': 'me', id: label.id}).then(result => {
          if (result.id === 'CATEGORY_PROMOTIONS' || result.id === 'CATEGORY_SOCIAL') {
            myTotal -= result.messagesUnread;
          } else if (result.id === 'UNREAD') {
            myTotal += result.messagesUnread;
          }
          result = result.result
          appendPre(`${result.name}: Total: ${result.messagesTotal} Unread: ${result.messagesUnread} Threads: ${result.threadsTotal} Unread: ${result.threadsUnread}`);
        });
      });
    } else {
      appendPre('No Labels found.');
    }
  });

  // Get custom total
  const promos = await gapi.client.gmail.users.labels.get({ userId: 'me', id: 'CATEGORY_PROMOTIONS' });
  const social = await gapi.client.gmail.users.labels.get({ userId: 'me', id: 'CATEGORY_SOCIAL' });
  const inbox = await gapi.client.gmail.users.labels.get({ userId: 'me', id: 'INBOX' });
  appendPre(`My Total: ${inbox.result.messagesUnread - promos.result.messagesUnread - social.result.messagesUnread}`)
}

