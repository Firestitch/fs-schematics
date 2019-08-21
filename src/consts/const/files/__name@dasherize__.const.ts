import { <%= classify(enumName) %> } from '<%= relativeEnumPath %>';

export const <%= classify(name) %> = [<%for (let en of enums) {%>
  { name: '<%=classify(en.key)%>', value: <%=enumName%>.<%=en.value%> },<%}%>
];
