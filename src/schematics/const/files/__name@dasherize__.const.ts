import { <%= classify(enumName) %> } from '<%= relativeEnumPath %>';

export const <%= classify(name) %> = [<%for (let en of enums) {%>
  { name: <%=enumName%>.<%=en.value%>, value: '<%=classify(en.key)%>' },<%}%>
];
