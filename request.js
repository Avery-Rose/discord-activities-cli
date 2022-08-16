const fetch = require("node-fetch");
const apps = require("./apps.json");

/**
 * @param {string} token
 * @param {string} id the id of the target channel
 * @param {string} activity the id of the activity
 * @returns {string} the invite link
 */
async function req(token, id, activity) {
  const res = await fetch(
    `https://discord.com/api/v10/channels/${id}/invites`,
    {
      method: "POST",
      headers: {
        authorization: token,
        "content-type": "application/json",
      },

      body: JSON.stringify({
        max_age: 86400,
        max_uses: 0,
        temporary: false,
        unique: true,
        target_type: 2,
        target_application_id: apps[activity],
        validate: null,
      }),
    }
  );
  if (res.status === 200) {
    const invite = await res.json();
    return `https://discord.com/invite/${invite.code}`;
  } else {
    process.stdout.write("\x1Bc");
    console.error(
      new Error(`Discord API: ${res.status}. Invalid ChannelID?`.red)
    );
    return "";
  }
}

module.exports = req;
