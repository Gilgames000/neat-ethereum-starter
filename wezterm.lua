local wezterm = require 'wezterm'
local mux = wezterm.mux

wezterm.on('gui-startup', function(cmd)
    local tab, pane, window
    tab, pane, window = mux.spawn_window {
        args = { 'bash', '-i', '-c', 'cd ' .. cmd.args[1] .. '; bash' },


    }
    tab:set_title 'neat-ethereum-starter'
    window:set_title 'neat-ethereum-starter'

    local pane_web = pane:split {
        args = { 'bash', '-i', '-c', 'cd ' .. cmd.args[1] .. '; sleep 1; pnpm start:web; bash' },
        direction = 'Bottom'
    }


    local pane_local_node = pane:split {
        args = { 'bash', '-i', '-c', 'cd ' .. cmd.args[1] .. '; sleep 1; pnpm start:local_node; bash' },
        direction = 'Right'
    }


    local pane_contracts_compile = pane_local_node:split {
        args = { 'bash', '-i', '-c', 'cd ' .. cmd.args[1] .. '; sleep 1; pnpm start:contracts:compile; bash' },
        direction = 'Bottom'
    }

    local pane_contracts_deploy = pane_contracts_compile:split {
        args = { 'bash', '-i', '-c', 'cd ' .. cmd.args[1] .. '; sleep 1; pnpm start:contracts:deploy; bash' },
        direction = 'Right'
    }
end)


config = {}

-- fix windows in virtualbox
config.prefer_egl = true

return config
