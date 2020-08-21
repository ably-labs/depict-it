import { LinkGenerator } from "../util/LinkGenerator.js";

export const InviteLink = {
  props: ['gameId'],

  computed: {
    inviteLink: function () {
      const linkGenerator = new LinkGenerator(window.location);
      return linkGenerator.linkTo({ gameId: this.gameId, join: true });
    },
  },

  template: `
    <div class="invite-link">
    <h2 class="section-heading">Invite your friends!</h2>
      <p>Share this link to invite people to play:</p>
      <copyable-text-box :value="inviteLink" />
    </div>
`
};