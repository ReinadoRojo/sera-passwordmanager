[spanish version](./README-ES.md)

# Sera Password Manager

Sera is a simple password manager, it's 100% open-source and it will be hosted for free.

Sera can be easily self-hosted if you want to use it for your own, it's a simple react app with an extension attached.

---

## Is this real safe?

Sera cryptography works fully on device, and all data sended to the server (only for storage) is fully encrypted, this is because we work with an architecture "Zero-Knowladge".

We (I) asked my self, why does the server needs to know the plain text? The response was simple: It doesn't need to know anything about passwords, that's because we don't manage our passwords with passwords. Let me explain...


To understand why I say this, let's ask us something before.
Q: Why does a server need plain data?
R: Because the server will process that data to search other data, per example, users ids, search queries, filters, etc...

All that data I said, is data the server needs to make another query, so, a password is not needed for make a query, the password is the RESULT of a query, the search term of the query in this app is the user id.

(( ... dang it seems this will be long ... ))