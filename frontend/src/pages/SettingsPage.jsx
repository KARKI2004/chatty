import { useEffect, useState } from "react";
import { useSettingsStore } from "../store/useSettingsStore";
import { useFriendStore } from "../store/useFriendStore";
import { useAuthStore } from "../store/useAuthStore";

const SettingsPage = () => {
  const { notificationSounds, enterToSend, showMessagePreview, setSetting } = useSettingsStore();
  const {
    requests,
    isRequestsLoading,
    isSendingRequest,
    isUpdatingRequest,
    fetchRequests,
    sendRequest,
    acceptRequest,
    declineRequest,
  } = useFriendStore();
  const { authUser } = useAuthStore();
  const [friendEmail, setFriendEmail] = useState("");

  useEffect(() => {
    if (authUser) {
      fetchRequests();
    }
  }, [authUser, fetchRequests]);

  const handleSendRequest = async (event) => {
    event.preventDefault();
    if (!authUser) return;
    const email = friendEmail.trim();
    if (!email) return;
    const ok = await sendRequest(email);
    if (ok) setFriendEmail("");
  };

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Preferences</h2>
          <p className="text-sm text-base-content/70">Tune the chat experience to your style</p>
        </div>

        <div className="grid gap-4">
          <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-6">
              <div>
                <h3 className="font-semibold">Notification sounds</h3>
                <p className="text-sm text-base-content/70">
                  Play a subtle sound when a new message arrives while this tab is active.
                </p>
              </div>
              <input
                type="checkbox"
                className="toggle"
                style={
                  notificationSounds
                    ? {
                        backgroundColor: "rgba(198,180,220,0.8)",
                        borderColor: "rgba(198,180,220,0.9)",
                        ["--tglbg"]: "rgba(246,242,252,0.95)",
                      }
                    : undefined
                }
                checked={notificationSounds}
                onChange={(e) => setSetting("notificationSounds", e.target.checked)}
              />
            </div>
          </div>

          <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-6">
              <div>
                <h3 className="font-semibold">Enter to send</h3>
                <p className="text-sm text-base-content/70">
                  Use Enter to send a message. Shift+Enter makes a new line.
                </p>
              </div>
              <input
                type="checkbox"
                className="toggle"
                style={
                  enterToSend
                    ? {
                        backgroundColor: "rgba(198,180,220,0.8)",
                        borderColor: "rgba(198,180,220,0.9)",
                        ["--tglbg"]: "rgba(246,242,252,0.95)",
                      }
                    : undefined
                }
                checked={enterToSend}
                onChange={(e) => setSetting("enterToSend", e.target.checked)}
              />
            </div>
          </div>

          <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-6">
              <div>
                <h3 className="font-semibold">Show message preview</h3>
                <p className="text-sm text-base-content/70">
                  Show a short preview under each contact in the sidebar.
                </p>
              </div>
              <input
                type="checkbox"
                className="toggle"
                style={
                  showMessagePreview
                    ? {
                        backgroundColor: "rgba(198,180,220,0.8)",
                        borderColor: "rgba(198,180,220,0.9)",
                        ["--tglbg"]: "rgba(246,242,252,0.95)",
                      }
                    : undefined
                }
                checked={showMessagePreview}
                onChange={(e) => setSetting("showMessagePreview", e.target.checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-6">
              <div>
                <h3 className="font-semibold">Add friend</h3>
                <p className="text-sm text-base-content/70">
                  Send a friend request using their email.
                </p>
              </div>
            </div>
            <form onSubmit={handleSendRequest} className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                className="input input-bordered w-full"
                placeholder="friend@example.com"
                value={friendEmail}
                onChange={(e) => setFriendEmail(e.target.value)}
              />
              <button
                type="submit"
                className="btn border border-base-300 bg-[rgba(198,180,220,0.85)] text-[rgb(64,52,82)] hover:bg-[rgba(198,180,220,0.95)]"
              >
                {isSendingRequest ? "Sending..." : "Send request"}
              </button>
            </form>
          </div>

          <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-6">
              <div>
                <h3 className="font-semibold">Friend requests</h3>
                <p className="text-sm text-base-content/70">
                  Accept or decline pending requests.
                </p>
              </div>
              <span className="text-xs text-base-content/60">{requests.length}</span>
            </div>

            <div className="mt-4 space-y-3">
              {isRequestsLoading ? (
                <div className="text-sm text-base-content/60">Loading requests...</div>
              ) : !authUser ? (
                <div className="text-sm text-base-content/60">Log in to view requests.</div>
              ) : requests.length === 0 ? (
                <div className="text-sm text-base-content/60">No pending requests.</div>
              ) : (
                requests.map((request) => (
                  <div
                    key={request._id}
                    className="flex flex-col gap-3 rounded-lg border border-base-300/70 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={request.profilePic || "/avatar.png"}
                        alt={request.fullName}
                        className="size-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium">{request.fullName}</div>
                        <div className="text-xs text-base-content/60">{request.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="btn btn-sm border border-base-300 bg-base-100"
                        onClick={() => acceptRequest(request._id)}
                        disabled={isUpdatingRequest}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-ghost"
                        onClick={() => declineRequest(request._id)}
                        disabled={isUpdatingRequest}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
