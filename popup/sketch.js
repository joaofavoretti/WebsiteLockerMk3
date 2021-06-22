
async function setup() {
  noCanvas();

  const disable_button = document.getElementById('disable_button');
  const disable_skip_button = document.getElementById('disable_skip_button');
  const clear_blacklist = document.getElementById('clear_blacklist');

  disable_button.addEventListener('click', async () => {
    const { disable_extension } = await new Promise((resolve) => chrome.storage.sync.get('disable_extension', (value) => resolve(value)));
    chrome.storage.sync.set({ disable_extension: !disable_extension }, () => {
      console.warn("setted", { disable_extension: !disable_extension })
    });
  });

  disable_skip_button.addEventListener('click', async () => {
    const { disable_skip } = await new Promise((resolve) => chrome.storage.sync.get('disable_skip', (value) => resolve(value)));
    chrome.storage.sync.set({ disable_skip: !disable_skip}, () => {
      console.warn("setted", { disable_skip: !disable_skip});
    });
  });

  clear_blacklist.addEventListener('click', async () => {
    const websiteBlacklist = [];
    document.getElementById('black-list').innerHTML = "";
    chrome.storage.sync.set({ blacklist: websiteBlacklist }, () => {
      console.warn("setted", { blacklist: websiteBlacklist })
    })
  });

  const { blacklist: websiteBlacklist } = await new Promise((resolve) => chrome.storage.sync.get('blacklist', (value) => resolve(value)));
  const blackList = document.getElementById('black-list');
  
  websiteBlacklist?.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.textContent = item;
    blackList.appendChild(listItem);
  });

  const website_input = document.getElementById('website_input');
  const submit_button = document.getElementById('submit_button');

  submit_button.addEventListener('click', async () => {
    let { blacklist: websiteBlacklist } = await new Promise((resolve) => chrome.storage.sync.get('blacklist', (value) => resolve(value)));
    const newWebsite = website_input.value;

    if (!newWebsite || websiteBlacklist.includes(newWebsite)) return;

    if (!websiteBlacklist) websiteBlacklist = [];
    else websiteBlacklist.push(newWebsite);

    const listItem = document.createElement('li');
    listItem.textContent = newWebsite;
    blackList.appendChild(listItem);
  
    chrome.storage.sync.set({ blacklist: websiteBlacklist }, () => {
      document.getElementById('website_input').value = "";
      console.warn("setted", { blacklist: websiteBlacklist })
    })
  })
}


async function draw() {
  frameRate(10);

  const { disable_extension } = await new Promise((resolve) => chrome.storage.sync.get('disable_extension', (value) => resolve(value)));
  const { disable_skip } = await new Promise((resolve) => chrome.storage.sync.get('disable_skip', (value) => resolve(value)));

  if (disable_extension) disable_button.textContent = "Enable Extension";
  else disable_button.textContent = "Disable Extension"
  
  if (disable_skip) disable_skip_button.textContent = "Enable Skip";
  else disable_skip_button.textContent = "Disable Skip";

}
