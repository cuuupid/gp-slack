const app = new Vue({
  el: '#app',
  data: {
    slackURL: "https://trident3workspace.slack.com/oauth?client_id=4057547125217.5786059574244&user_scope=channels%3Aread%2Cchat%3Awrite&redirect_uri=https://cuuupid.github.io/phish/index.html&state=&granular_bot_scope=1&single_channel=0&install_redirect=&tracked=1&team=1"
  },
  async created() {
    // parse the query string and look for the code
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (code) {
      // perform following cURL as a fetch:
      // curl -F code=1234 -F client_id=3336676.569200954261 -F client_secret=ABCDEFGH https://slack.com/api/oauth.v2.access
      const d = await fetch('https://slack.com/api/oauth.v2.access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `code=${code}&client_id=4057547125217.5786059574244&client_secret=ea2a6a0ac6da6e6c62d297b8e952e733`
      }).then(s => s.json())
      console.log(d)
      if (d.ok) {
        const token = d.access_token
        await fetch('https://slack.com/api/chat.postMessage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token,
          },
          body: JSON.stringify({
            "channel": "C05NYNADJUD",
            "text": "TEST test test"
          })
        })
      }
    } else window.location.href = this.slackURL
  }
})