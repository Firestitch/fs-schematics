<% if (create) { %>export * from './create';<% } %>
<% if (edit) { %>export * from './edit';<% } %>
export * from './<%=dasherize(name)%>.component';
