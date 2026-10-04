Alfrzo – Phase 1 static prototype
Static site (one index.html + assets/img/). No build step.
Demo only. Data lives in your browser's localStorage. It is NOT a database, NOT secure or private, and is NOT shared between devices or users. Login is a demo gate, not authentication, until Supabase Auth is added (Phase 2). No payment provider is connected.
Structure
index.html
assets/img/  hero.jpg, city-*.jpg (12), room-1..4.jpg
README.md  TESTING_REPORT.md  PHASE2_REQUIREMENTS.md
Image note: the 17 images were cut from the contact-sheet PNG (the ZIP was not provided), so they are lower resolution than the sizes in the labels. To upgrade, overwrite the files in assets/img/ with the originals using the same file names. Missing images fall back to generated skyline art.
Run locally
python3 -m http.server 8000 in this folder, then open http://localhost:8000
Deploy on GitHub Pages
Create a GitHub repository and upload all files, keeping assets/img/ (or git add . && git commit && git push).
Repo Settings → Pages.
Source: Deploy from a branch, branch main, folder / (root), Save.
Wait about a minute; the site appears at https://<user>.github.io/<repo>/.
Hard-refresh after updates. Image paths are relative, so project sub-paths work.
How the demo works
Menu → Owner Dashboard → "Continue to demo": overview, listings (add/edit/delete/publish/availability), bookings (accept/reject/cancel/update status), profile, reviews, notifications, earnings (demo, not connected), logout.
Customer Book creates a pending request; the owner's decision shows in My Bookings in the same browser. Accepted bookings can be reviewed.
One demo owner manages requests for all rooms, including the 10 sample rooms.
Reset demo data: browser dev tools → Application → Local Storage → clear keys starting with al_.
