# Forms Pattern

## Purpose

Forms collect data with accessible, validatable HTML structure.

## Rules

✅ **DO** use `label` with `for` + matching `id`
✅ **DO** use semantic grouping with `fieldset` and `legend`
✅ **DO** expose validation feedback with `aria-describedby`
✅ **DO** keep submit behavior progressive (works without JS when possible)

❌ **DO NOT** use placeholders as label replacement
❌ **DO NOT** hide error messages from assistive technologies

## Example: Contact Form

```html
<form class="contact-form" action="/contact" method="post" novalidate>
  <fieldset>
    <legend>Contact Information</legend>

    <div class="form-field">
      <label for="name">Name</label>
      <input id="name" name="name" type="text" required autocomplete="name" />
    </div>

    <div class="form-field">
      <label for="email">Email</label>
      <input id="email" name="email" type="email" required autocomplete="email" aria-describedby="email-help" />
      <small id="email-help">Use a valid email address.</small>
    </div>
  </fieldset>

  <button type="submit">Send</button>
</form>
```
