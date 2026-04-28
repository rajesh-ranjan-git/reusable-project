import readline from "readline";

const BASE_URL = "http://localhost:1995/api/v1";
const USER_PASSWORD = "Rajesh@0";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (question) =>
  new Promise((resolve) => rl.question(question, resolve));

async function login(email, password) {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const response = await res.json();

    if (!res.ok) {
      throw new Error(
        `Login failed for "${email}": ${response.message || res.statusText}`,
      );
    }

    return response.data.accessToken;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

async function getUsers(accessToken) {
  try {
    const res = await fetch(`${BASE_URL}/admin/user/list?page=2`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const response = await res.json();

    if (!res.ok) {
      throw new Error(
        `Failed fetching users: ${response.message || res.statusText}`,
      );
    }

    return response.data.users || [];
  } catch (error) {
    console.error(error.message);
    return [];
  }
}

async function connectUser(accessToken, userId) {
  try {
    const res = await fetch(`${BASE_URL}/connection/connect/${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "interested" }),
    });

    const response = await res.json();

    if (!res.ok) {
      throw new Error(`Connect failed: ${response.message || res.statusText}`);
    }

    console.log(`✅ Connected -> ${userId}`);
  } catch (error) {
    console.error(`❌ ${userId}: ${error.message}`);
  }
}

async function main() {
  try {
    console.log("\nLogging in admin...");
    const adminAccessToken = await login(
      "super.admin@server.com",
      "SuperAdmin@0",
    );

    if (!adminAccessToken) {
      console.log("Admin login failed.");
      process.exit(1);
    }

    console.log("Fetching users...");
    const users = await getUsers(adminAccessToken);

    const emails = users.map((user) => user.accounts[0].email).filter(Boolean);

    console.log(`Found ${emails.length} users`);

    for (const email of emails) {
      console.log(`\nProcessing ${email}...`);

      const userAccessToken = await login(email, USER_PASSWORD);

      if (!userAccessToken) {
        console.log(`Skipping ${email}`);
        continue;
      }

      await connectUser(userAccessToken, "69f095e87e4b565ebcc19383");
    }

    console.log("\nDone.");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
