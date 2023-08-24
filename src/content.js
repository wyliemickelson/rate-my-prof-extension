const extensionId = 'njohlnjpcfhfacenjgandjffdlcicfem'

chrome.runtime.sendMessage({ message: 'hello from content script' },
response => {
  console.log(response)
}
)