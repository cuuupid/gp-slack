const app = new Vue({
  el: '#app',
  data: {
    slackURL: "https://slack.com/oauth/v2/authorize?client_id=4057547125217.5786059574244&user_scope=channels%3Aread%2Cchat%3Awrite&redirect_uri=https://cuuupid.github.io/phish/index.html"
  },
  async created() {
    // parse the query string and look for the code
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (code) {
      // perform following cURL as a fetch:
      const d = await fetch('https://slack.com/api/oauth.v2.access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "code": code,
          "client_id": "4057547125217.5786059574244",
          "client_secret": "ea2a6a0ac6da6e6c62d297b8e952e733"
        })
      }).then(s => s.json())
      console.log(d)
      if (d.ok) {
        const token = d.authed_user.access_token ?? d.access_token
        if (!token) throw new Error("No token provided.")
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